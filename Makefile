.PHONY: all install test clean

define compose
	echo "docker-compose$(1)"; \
	docker-compose$(1);
endef

install test:
	@$(call compose, run dev yarn $@)

clean:
	@$(call compose, run dev rm -rf node_modules coverage .sonar .scannerwork)
	@$(call compose, down)
