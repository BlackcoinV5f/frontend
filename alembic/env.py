import asyncio
import os
import sys
from logging.config import fileConfig
from alembic import context
from sqlalchemy import pool, create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from dotenv import load_dotenv

# === Charger les variables d'environnement ===
load_dotenv()

# === Ajouter le dossier backend au sys.path ===
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

# === Importer Base et tous les modèles pour qu'ils soient enregistrés ===
from database import Base
from utils import user, transaction, activity, status, mail  # Ne pas redéfinir target_metadata ici

# === Metadata des modèles pour autogénération des migrations ===
target_metadata = Base.metadata

# === Configuration Alembic ===
config = context.config

# === Configuration du logging ===
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# === Détection du mode de migration ===
is_offline = context.is_offline_mode()
is_autogenerate = "--autogenerate" in sys.argv

# === Choix de l'URL selon le mode (sync ou async) ===
if is_autogenerate or is_offline:
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL_SYNC")
    engine = create_engine(SQLALCHEMY_DATABASE_URL, poolclass=pool.NullPool)
else:
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL, poolclass=pool.NullPool)

# === Fonction pour les migrations offline ===
def run_migrations_offline():
    context.configure(
        url=SQLALCHEMY_DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

# === Fonction pour les migrations en ligne ===
def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

# === Async version des migrations ===
async def run_migrations_online_async():
    async with engine.begin() as conn:
        await conn.run_sync(do_run_migrations)

# === Sync version des migrations (pour autogenerate) ===
def run_migrations_online_sync():
    with engine.connect() as connection:
        do_run_migrations(connection)

# === Lancer selon le mode ===
if is_offline:
    run_migrations_offline()
elif is_autogenerate:
    run_migrations_online_sync()
else:
    asyncio.run(run_migrations_online_async())
