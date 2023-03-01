import createClient from "@sanity/client";

console.log(process.env)
export default createClient({
  projectId: process.env.VUE_APP_projectId, 
  dataset: "production", 
  useCdn: true,
  apiVersion: process.env.VUE_APP_apiVersion,
  token: process.env.VUE_APP_token
});