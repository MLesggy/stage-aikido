const axios = require("axios");

// Routes settings default: http://localhost:8000/api/
const addressAPI = "http://localhost:";
const portAPI = 8000;
const suffixAPI = "/api/";
const routeMethods = ["GET"];
const routeNames = [
  "address",
  "admins",
  "attackFormsDanRelevance",
  "attackForms",
  "clubSchedules",
  "clubs",
  "danGrades",
  "grades",
  "images",
  "links",
  "milestones",
  "recommendations",
  "seminars",
  "techniquesDanRelevance",
  "techniques",
  "workForms",
];
const routeVariantes = ["", "/1"];

async function testRoute(route) {
  try {
    const options = {
      method: route.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (route.method !== "GET" && route.body) {
      options.body = JSON.stringify(route.body);
    }

    const response = await fetch(route.url, options);
    const isSuccess = response.status >= 200 && response.status < 300;

    console.log(
      `${route.method} ${route.url}: ${response.status} ${
        isSuccess ? "✓" : "✗"
      }`
    );

    if (!isSuccess) {
      console.error(`Error for ${route.method} ${route.url}`);
    }

    return { route, status: response.status, success: isSuccess };
  } catch (error) {
    console.error(`Exception for ${route.method} ${route.url}:`, error.message);
    return { route, error: error.message, success: false };
  }
}

async function testAllRoutes() {
  //Creating routes
  const routes = [];

  //for each routes (admins, address, links....)
  for (const route of routeNames) {
    //for each method (get, post, put...)
    for (const method of routeMethods) {
      //for each variant ('/1', '/' ...)
      for (const variant of routeVariantes) {
        routes.push({
          method: `${method}`,
          url: `${addressAPI}${portAPI}${suffixAPI}${route}${variant}`,
        });
      }
    }
  }

  console.log(`Created ${routes.length} routes`);
  console.log("Testing routes...");

  const results = await Promise.all(routes.map(testRoute));

  const failures = results.filter((r) => !r.success);

  console.log("\nSummary:");
  console.log(`Total: ${results.length}`);
  console.log(`Success: ${results.length - failures.length}`);
  console.log(`Failures: ${failures.length}`);

  if (failures.length > 0) {
    console.log("\n Routes failed:");
    failures.forEach((f) => {
      console.log(`- ${f.route.method} ${f.route.url}: ${f.status || f.error}`);
    });
  }
}

testAllRoutes();
