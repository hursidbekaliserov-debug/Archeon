.PHONY: up seed dev test e2e verify-audit install clean

up:
	docker compose -f infra/docker-compose.yml up --build

seed:
	npm run seed

dev:
	npm run dev

test:
	npm run test

e2e:
	npm run test:e2e

verify-audit:
	npm run verify-audit

install:
	npm install
	cd apps/worker && pip install -r requirements.txt

clean:
	rm -rf node_modules .next apps/web/.next
