import { defineConfig, envField } from "astro/config";
import clerk from "@clerk/astro";
import node from "@astrojs/node";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

export default defineConfig({
	integrations: [clerk(), react(), tailwind()],
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	experimental: {
        env: {
			schema: {
				DB_FILE_NAME: envField.string({
					context: "server",
					access: "public",
				}),
				PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
					context: "server",
                    access: "secret",
				}),
				CLERK_SECRET_KEY: envField.string({
					context: "server",
					access: "secret",
				}),
                
			},
		},
    },
});
