from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

from src import settings
from src.kafka import kafka_producer


class Bot:
    application = None

    @staticmethod
    async def start(update: Update, context: "ContextTypes.DEFAULT_TYPE") -> None:
        args = context.args
        state = args[0] if args else None
        user = update.effective_user

        user_info = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "language_code": user.language_code,
            "is_bot": user.is_bot,
            "is_premium": user.is_premium,
            "chat_id": update.effective_chat.id if update.effective_chat else None
        }

        message = {
            "state": state,
            "user_info": user_info
        }

        print("Отправка сообщения в Kafka:", message)
        await kafka_producer.send_message(settings.KAFKA_TELEGRAM_BOT_TOPIC, message)


