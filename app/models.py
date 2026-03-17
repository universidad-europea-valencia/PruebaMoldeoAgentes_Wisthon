from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def _enum_values(enum_cls: type[Enum]) -> list[str]:
    return [member.value for member in enum_cls]


class Base(DeclarativeBase):
    pass


class TipoMaquina(str, Enum):
    MOLDEO = "moldeo"
    MACHERIA = "macheria"
    ACABADO = "acabado"


class EstadoMaquina(str, Enum):
    OPERATIVO = "operativo"
    AVERIA = "averia"
    MANTENIMIENTO = "mantenimiento"


class RutaAcabado(str, Enum):
    ROBOT = "robot"
    MANUAL = "manual"
    CNC = "cnc"


class Material(Base):
    __tablename__ = "materiales"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)


class MatrizTransicion(Base):
    __tablename__ = "matriz_transicion"

    metal_origen: Mapped[str] = mapped_column(String(50), primary_key=True)
    metal_destino: Mapped[str] = mapped_column(String(50), primary_key=True)
    tiempo_minutos: Mapped[int] = mapped_column(Integer, nullable=False)
    coste_energetico: Mapped[float] = mapped_column(Float, nullable=False)


class Maquina(Base):
    __tablename__ = "maquinas"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    tipo: Mapped[TipoMaquina] = mapped_column(
        SqlEnum(TipoMaquina, values_callable=_enum_values, native_enum=False),
        nullable=False,
    )
    estado: Mapped[EstadoMaquina] = mapped_column(
        SqlEnum(EstadoMaquina, values_callable=_enum_values, native_enum=False),
        default=EstadoMaquina.OPERATIVO,
        nullable=False,
    )


class OrdenProduccion(Base):
    __tablename__ = "ordenes_produccion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    referencia: Mapped[str] = mapped_column(String(100), nullable=False)
    cantidad_total: Mapped[int] = mapped_column(Integer, nullable=False)
    fecha_entrega: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    metal_id: Mapped[str] = mapped_column(ForeignKey("materiales.id"), nullable=False)
    requiere_macho: Mapped[bool] = mapped_column(nullable=False)
    ruta_acabado: Mapped[RutaAcabado] = mapped_column(
        SqlEnum(RutaAcabado, values_callable=_enum_values, native_enum=False),
        nullable=False,
    )

    material: Mapped[Material] = relationship(Material)
