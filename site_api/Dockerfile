FROM python:3.9

WORKDIR /code

COPY ./req.txt /code/req.txt

RUN pip install --no-cache-dir --upgrade -r /code/req.txt

COPY ./src /code/app

WORKDIR /code/app

EXPOSE 20

CMD [ "uvicorn", "main:app", "--ssl-keyfile", "cert/key.pem", "--ssl-certfile", "cert/cert.pem", "--port", "20", "--host", "0.0.0.0" ]