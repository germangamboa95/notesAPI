import fastify from "fastify";
import { createNote, getNotes } from "./notes";
import fastifySwagger from "@fastify/swagger";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import fastifySwaggerUI from "@fastify/swagger-ui";
import { z } from "zod";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "SampleApi",
      description: "Sample backend service",
      version: "1.0.0",
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUI, {
  routePrefix: "/documentation",
});

server.after(() => {
  server.server.get("/notes", async (request, reply) => {
    const notes = getNotes();
    return notes;
  });

  server.post(
    "/notes",
    {
      schema: {
        body: z.object({
          data: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const incoming_note = request.body;
      createNote(incoming_note);
      return getNotes();
    }
  );
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
