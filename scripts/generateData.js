const fs = require("fs");
 const platforms = [
    "amazon",
    "flipkart",
    "myntra",
    "ajio",
    "croma",
    "reliance digital",
    "vijay sales",
    "tatacliq",
    "snapdeal",
    "meesho",
    "zepto",
    "blinkit",
    "bigbasket",
    "jiomart",
    "paytm mall",
    "shopclues"
  ];

  const productNames = [
    "iphone 15", "iphone 14", "samsung s23", "oneplus 11",
    "macbook air", "macbook pro", "airpods pro",
    "boat earbuds", "sony headphones", "ipad air"
  ];

  function randomPrice(base) { 
    return base + Math.floor(Math.random() * 5000 - 2500) ; 

  }

  const data = [] ; 

 for(let i = 0 ; i < 1000 ; ++i){ 
    const name = productNames[Math.floor(Math.random() * productNames.length)]
    const basePrice = Math.floor(Math.random () * 80000) + 10000; 
    platforms.forEach(platform => { 
        data.push({ 
            name : name.toLowerCase() , 
            price : randomPrice(basePrice), 
        platform , 
            priceHistory: [
                { price: randomPrice(basePrice - 2000), recordedAt: new Date() },
                { price: randomPrice(basePrice - 1000), recordedAt: new Date() }
            ]
        })
    })
 }

 fs.writeFileSync("dummyData.json" , JSON.stringify(data, null, 2)) ;
 console.log(" Dummy data generated");
