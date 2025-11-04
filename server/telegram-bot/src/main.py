from telegram.ext import ApplicationBuilder, CommandHandler
import asyncio
from src.bot.bot import Bot
from src.kafka.consumer import kafka_consumer
from src.kafka.producer import kafka_producer
from src.settings import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def handle_kafka_response(data: dict):
    chat_id = data.get("chat_id")
    message_text = data.get("message")
    print("Пришло сообщение из Kafka:", data)

    if chat_id and message_text:
        await Bot.application.bot.send_message(chat_id=chat_id, text=message_text)


async def main():
    max_retries = 10
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Попытка подключения к Kafka ({attempt + 1}/{max_retries})...")
            await kafka_producer.start()
            await kafka_consumer.start([settings.KAFKA_TELEGRAM_BOT_RESPONSE_TOPIC])
            logger.info("Успешно подключено к Kafka")
            break
        except Exception as e:
            logger.warning(f"Ошибка подключения к Kafka: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Повтор через {retry_delay} секунд...")
                await asyncio.sleep(retry_delay)
            else:
                logger.error("Не удалось подключиться к Kafka после всех попыток")
                raise

    kafka_consumer.register_handler(
        settings.KAFKA_TELEGRAM_BOT_RESPONSE_TOPIC,
        handle_kafka_response
    )

    app = ApplicationBuilder().token(settings.BOT_TOKEN).build()
    Bot.application = app

    app.add_handler(CommandHandler("start", Bot.start))

    consumer_task = asyncio.create_task(kafka_consumer.consume())

    await app.initialize()
    await app.start()
    await app.updater.start_polling()

    try:
        await asyncio.Event().wait()
    except (KeyboardInterrupt, SystemExit):
        pass
    finally:
        await app.updater.stop()
        await app.stop()
        await app.shutdown()
        await kafka_consumer.stop()
        await kafka_producer.stop()
        consumer_task.cancel()


if __name__ == "__main__":
    asyncio.run(main())