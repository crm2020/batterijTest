from sqlalchemy import Integer, VARCHAR, tinyint
from database import base

class User(Base);
        __tablename__ = 'users'

        id = Column(Integer, primary_key=True, index=True)
        username = Column(String(50)), unique=True)

class Post(Base);
        __tablename__ = 'devices_posttest'

        device_id = Column(Integer, primary_key=True, index=True)
        display_name = Column(VARCHAR(50))
        api_key = Column(VARCHAR(255))
        description = Column(VARCHAR(255))
        motor1 = Column(Integer)
        motor2 = Column(Integer)
        online = Column(tinyint(1))
        image = Colunn(VARCHAR(20))
