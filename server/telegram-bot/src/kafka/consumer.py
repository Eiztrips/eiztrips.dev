import json
from aiokafka import AIOKafkaConsumer
from src.settings import settings
from typing import Dict, Callable, Awaitable

class KafkaConsumer:
    def __init__(self):
        self.consumer = None
        self.handlers: Dict[str, Callable[[dict], Awaitable[None]]] = {}
        self.running = False

    async def start(self, topics: list):
        self.consumer = AIOKafkaConsumer(
            *topics,
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_deserializer=lambda v: json.loads(v.decode('utf-8')),
            group_id='telegram_bot_consumer_group',
            auto_offset_reset='latest'
        )
        await self.consumer.start()
        self.running = True

    async def stop(self):
        self.running = False
        if self.consumer:
            await self.consumer.stop()

    def register_handler(self, topic: str, handler: Callable[[dict], Awaitable[None]]):
        self.handlers[topic] = handler

    async def consume(self):
        try:
            async for message in self.consumer:
                topic = message.topic
                data = message.value

                if topic in self.handlers:
                    await self.handlers[topic](data)
        except Exception as e:
            print(f"Ошибка при обработке сообщения из Kafka: {e}")


kafka_consumer = KafkaConsumer()
