FROM python:3.9

WORKDIR /code

COPY ./req.txt /code/req.txt

RUN pip install --no-cache-dir --upgrade -r /code/req.txt

COPY ./src /code/app
COPY ./private.json /code/app

WORKDIR /code/app

CMD [ "uvicorn", "dataRetriever:app", "--ssl-keyfile", "cert/key.pem", "--ssl-certfile", "cert/cert.pem", "--port", "8007", "--host", "0.0.0.0" ]
# CMD [ "fastapi", "run", "app/dataRetriever.py", "--port", "8007" ]
