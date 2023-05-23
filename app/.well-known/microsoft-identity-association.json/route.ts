export async function GET(request: Request) {
    return new Response("{\n" +
        "    \"associatedApplications\": [\n" +
        "        {\n" +
        "            \"applicationId\": \"79bb8b12-5f76-41f9-b0df-2489df28cf94\"\n" +
        "        }\n" +
        "    ]\n" +
        "}");
}