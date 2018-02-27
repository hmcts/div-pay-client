.PHONY: all install test clean

define compose
	echo "docker-compose$(1)"; \
	docker-compose$(1);
endef

install test:
	@$(call compose, run dev yarn $@)

sonar-scan-pr:
	@$(call compose, run dev yarn sonar-scanner -Dsonar.analysis.mode=preview -Dsonar.host.url=${SONARQUBE_URL})

sonar-scan:
	@$(call compose, run dev yarn sonar-scanner -Dsonar.host.url=${SONARQUBE_URL})

clean:
	@$(call compose, run dev rm -rf node_modules coverage .sonar .scannerwork)
	@$(call compose, down)
