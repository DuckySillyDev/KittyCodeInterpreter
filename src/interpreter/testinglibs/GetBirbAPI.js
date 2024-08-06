const libaryFunctions = [
  {
      name: "getBirb",
      args: [],
      execution: async () => {
          const options = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
          };
            
          const response = await fetch('https://v2.yiff.rest/animals/birb', options);
          const birb = await response.json();
          const url = '' + birb.images[0].url;
          return KittyCodeCoreFunctions.log(url);
      }
  }
];

module.exports = libaryFunctions;
