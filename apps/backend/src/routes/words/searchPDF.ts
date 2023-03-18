import type { FastifyInstance } from "fastify";
import fluentSchema from "fluent-json-schema";
import Pdf from "../../models/pdf.js";
import type { SearchGeneric } from "../../types.js";

const searchPDF = async (fastify: FastifyInstance): Promise<void> => {
  const QuerySchema = fluentSchema
    .object()
    .prop("searchTerm", fluentSchema.string().required());

  fastify.get<SearchGeneric>(
    "/search",
    { schema: { querystring: QuerySchema } },
    async function saveWord(request, reply) {
      const { searchTerm } = request.query;

      const searchResults = await Pdf.find(
        {
          $text: { $search: searchTerm },
        },
        "creator title _id"
      ).limit(10);

      // SEARCH NOW WORKS, RETURN ONLY THE ID FOR THE SEARCHED RESULTS.

      return await reply.send(searchResults);
    }
  );
};

export default searchPDF;
