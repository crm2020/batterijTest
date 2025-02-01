# batterijTest

project 5/6 

- De opdracht gever is Christiaan Tempelman
- Er zijn een aantal problemen met de Site, de dep_api, en de andere code. Hieronder vallen onder andere de volgende punten:
	+ De site heeft een aantal niet geïmplementeerde of niet afgemaakte functionaliteiten, zoals:
		- een tijdsinterval voor rapporten,
		- een aantal rapporten op de thuispagina,
		- het selecteren van een bepaalde sensor voor het weergeven van de data ervan,
		- het weergeven van alle mogelijke data van een testsysteem,
		- het aanmaken van gebruikters
		- en geen encryptie voor de verbinding tussen de gebruiker en de server.
	+ De dep_api heeft geen beveiliging:
		- geen encryptie voor communicatie tussen server en gebruiker,
		- geen check of iemand wel bij de opgevraagde data mag.
	+ De nieuwe site_api is nog niet gemaakt om de deprecated api te fixen
- Wat is waar te vinden:
	+ Backup van de database in database dir
	+ deprecated API code in dep_api dir
	+ sensor API code onder de naam dataRetriever.py en een gedeelte van Christiaan Tempelmans testsysteem code in sensor_api dir
	+ site code in Site dir
	+ simpele setup voor fastAPI in site_api dir
- De nieuwe API is geschreven met fastAPI, dus in Python.