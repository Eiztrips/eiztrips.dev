from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", case_sensitive=True)

    BOT_TOKEN: str

    KAFKA_BOOTSTRAP_SERVERS: str
    KAFKA_TELEGRAM_BOT_TOPIC: str
    KAFKA_TELEGRAM_BOT_RESPONSE_TOPIC: str


settings = Settings()
