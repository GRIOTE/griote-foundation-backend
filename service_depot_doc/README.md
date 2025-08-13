# Service Depot Doc — Microservice de Dépôt et Consultation de Projets

---

# Service Depot Doc — Project Submission and Consultation Microservice (ENGLISH)

## Overview
This microservice allows you to submit, store, consult, and download projects (documents, files) securely. It is designed to integrate into a modular system, with user management handled by an external service.

## Main Features
- Project submission with metadata (title, description, theme, institution, etc.) and file upload
- Search and consult submitted projects
- Secure file download
- HTTP Basic authentication (test user: admin/admin)
- Integration with an external user microservice (via userId)
- File storage on disk (`/uploads`)
- Integrated OpenAPI/Swagger documentation
- Centralized error handling
- Unit and integration tests

## Technologies Used
- Java 21
- Spring Boot 3 (Web, Data JPA, Security)
- PostgreSQL
- Lombok
- OpenAPI (springdoc)
- JUnit, Mockito

## How to Run the Project
1. **Configure PostgreSQL database**
	 - Create a database and set credentials in `src/main/resources/application.properties`.
2. **Build and start**
	 ```sh
	 mvn clean install
	 mvn spring-boot:run
	 ```
3. **Access the API**
	 - Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
	 - Main endpoints:
		 - `POST /api/projects`: submit a project (multipart/form-data)
		 - `GET /api/projects/{id}`: get a project
		 - `GET /api/projects/search`: search projects
		 - `GET /api/projects/{id}/download`: download the file

## Example Submission Request (cURL)
```sh
curl -u admin:admin -X POST http://localhost:8080/api/projects \
	-F 'depot={"title":"Title","description":"Desc","userId":1}';type=application/json' \
	-F 'file=@/path/to/file.pdf'
```

## Security
- HTTP Basic authentication (default: admin/admin)
- All endpoints are protected except Swagger

## Best Practices Applied
- Code and documentation in English
- Clear separation: service, repository, DTO, mapper, controller
- Centralized error handling
- Unit and integration tests
- REST standards respected (200, 404, etc.)

## Project Structure

```
src/
	main/
		java/Griote/service_depot_doc/
			controller/      # REST controllers
			service/         # Business services
			repository/      # Database access
			model/           # JPA entities
			dto/             # Data transfer objects
			mapper/          # DTO <-> Entity mappers
			filestorage/     # File management
		resources/
			application.properties
			static/
			templates/
	test/
		java/Griote/service_depot_doc/   # Unit and integration tests
```

## Présentation
Ce microservice permet de déposer, stocker, consulter et télécharger des projets (documents, fichiers) de façon sécurisée. Il est conçu pour s’intégrer dans un système modulaire, avec gestion des utilisateurs via un service externe.

## Fonctionnalités principales
- Dépôt de projet avec métadonnées (titre, description, thème, institution, etc.) et fichier joint
- Recherche et consultation des projets déposés
- Téléchargement sécurisé des fichiers
- Authentification HTTP Basic (utilisateur de test : admin/admin)
- Intégration avec un microservice utilisateur externe (via userId)
- Stockage des fichiers sur le disque (`/uploads`)
- Documentation OpenAPI/Swagger intégrée
- Gestion centralisée des erreurs
- Tests unitaires et d’intégration

## Technologies utilisées
- Java 21
- Spring Boot 3 (Web, Data JPA, Security)
- PostgreSQL
- Lombok
- OpenAPI (springdoc)
- JUnit, Mockito

## Lancement du projet
1. **Configurer la base PostgreSQL**
	 - Créez une base et renseignez les accès dans `src/main/resources/application.properties`.
2. **Compiler et lancer**
	 ```sh
	 mvn clean install
	 mvn spring-boot:run
	 ```
3. **Accéder à l’API**
	 - Swagger UI : [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
	 - Endpoints principaux :
		 - `POST /api/projects` : dépôt de projet (multipart/form-data)
		 - `GET /api/projects/{id}` : consulter un projet
		 - `GET /api/projects/search` : rechercher des projets
		 - `GET /api/projects/{id}/download` : télécharger le fichier

## Exemple de requête dépôt (cURL)
```sh
curl -u admin:admin -X POST http://localhost:8080/api/projects \
	-F 'depot={"title":"Titre","description":"Desc","userId":1}';type=application/json' \
	-F 'file=@/chemin/vers/fichier.pdf'
```

## Sécurité
- Authentification HTTP Basic (admin/admin par défaut)
- Les endpoints sont protégés, sauf Swagger

## Bonnes pratiques appliquées
- Code et documentation en anglais
- Couche service, repository, DTO, mapper, controller bien séparées
- Gestion des erreurs centralisée
- Tests unitaires et d’intégration
- Respect des standards REST (200, 404, etc.)

## Structure du projet

```
src/
	main/
		java/Griote/service_depot_doc/
			controller/      # Contrôleurs REST
			service/         # Services métier
			repository/      # Accès base de données
			model/           # Entités JPA
			dto/             # Objets de transfert
			mapper/          # Mappers DTO <-> Entity
			filestorage/     # Gestion fichiers
		resources/
			application.properties
			static/
			templates/
	test/
		java/Griote/service_depot_doc/   # Tests unitaires et intégration
```

