.DEFAULT_GOAL:=help

## Setting variables
SHELL := /bin/bash
ENV="local"

COMPOSE_PREFIX_CMD := HOST_UID=$(shell id -u)
COMMAND ?= /bin/bash
DOCKER_COMPOSE_FILE=docker-compose.yml

.PHONY: install start stop ps logs

install:
	if [ ! -f ./.env ]; then cp ./config/env/.env.dist ./.env; fi
	$(COMPOSE_PREFIX_CMD) docker-compose -f $(DOCKER_COMPOSE_FILE) build
	npm ci

start:
	$(COMPOSE_PREFIX_CMD) docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	npm run dev

stop:
	$(COMPOSE_PREFIX_CMD) docker-compose -f $(DOCKER_COMPOSE_FILE) down

ps:
	$(COMPOSE_PREFIX_CMD) docker-compose -f $(DOCKER_COMPOSE_FILE) ps

logs:
	${COMPOSE_PREFIX_CMD}  docker-compose -f ${DOCKER_COMPOSE_FILE} logs -t -f --tail 100
