const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

const MAX_COST = 250;
const COURIER_COSTS = [
  { maxWeight: 200, cost: 5 },
  { maxWeight: 500, cost: 10 },
  { maxWeight: 1000, cost: 15 },
  { maxWeight: 5000, cost: 20 },
];
const maxWeightPerPackage = COURIER_COSTS[3].maxWeight;
const calculateSelectedItemsTotalWeight = (items) => {
  const selectedItems = items.filter((item) => item.selected);
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return { totalWeight, totalPrice };
};

const calculateNumberOfPackages = (totalPrice) => {
  return Math.floor(totalPrice / 250) + 1;
};

// const isPushingPackageEligible = (singlePackage) => {
//   return true;
// };

const calculateCourierPrice = (totalWeight) => {
  const cost = COURIER_COSTS.find((c) => totalWeight <= c.maxWeight);
  return cost ? cost.cost : COURIER_COSTS[COURIER_COSTS.length - 1].cost;
};

const distributeByWeightAndPrice = (selectedItems, totalPackageRequired) => {
  // Sort items by weight in descending order
  selectedItems.sort((a, b) => b.weight - a.weight);

  const totalNoOfItem = selectedItems.length;

  const packages = Array.from({ length: totalPackageRequired }, () => ({
    items: [],
    totalWeight: 0,
    totalPrice: 0,
    courierPrice: 0,
  }));

  for (const item of selectedItems) {
    let placed = false;
    let packageIndex = 0;

    do {
      const currentPackage = packages[packageIndex];

      if (currentPackage.totalPrice + item.price <= 250) {
        currentPackage.items.push(item.name);
        currentPackage.totalWeight += item.weight;
        currentPackage.totalPrice += item.price;
        placed = true;
      } else {
        packageIndex = (packageIndex + 1) % totalPackageRequired;
      }
    } while (!placed && packageIndex !== 0);
  }

  packages.forEach((pkg) => {
    pkg.courierPrice = calculateCourierPrice(pkg.totalWeight);
  });

  return packages;
};

app.post("/place-order", (req, res) => {
  const selectedItems = req.body.products;
  console.log("selectedItems", selectedItems);

  if (!selectedItems || !selectedItems.length) {
    return res.status(400).json({ message: "No items selected!" });
  }

  const { totalPrice, totalWeight } =
    calculateSelectedItemsTotalWeight(selectedItems);

  console.log("totalPrice: " + totalPrice);
  console.log("totalWeight: " + totalWeight);

  const totalPackageRequired = calculateNumberOfPackages(totalPrice);

  console.log(totalPackageRequired);

  const distributedByWeight = distributeByWeightAndPrice(
    selectedItems,
    totalPackageRequired,
    totalWeight
  );

  res.json({ success: true, data: distributedByWeight });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
