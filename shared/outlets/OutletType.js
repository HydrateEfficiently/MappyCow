define(function (require) {

	var OutletTypeIds = {
		Unknown: 0,
		Store: 1,
		VegetarianRestaraunt: 2,
		VeganRestaraunt: 3,
		VegFriendlyRestaraunt: 4
	};

	var OutletTypeNames = {};
	OutletTypeNames[OutletTypeIds.Store] = "Stores 'n' More";
	OutletTypeNames[OutletTypeIds.VegetarianRestaraunt] = "Vegetarian Restaurant";
	OutletTypeNames[OutletTypeIds.VeganRestaraunt] = "Vegan Restaurant";
	OutletTypeNames[OutletTypeIds.VegFriendlyRestaraunt] = "Veg-Friendly Restaurant";

	var OutletTypeAbbreviations = {};
	OutletTypeAbbreviations[OutletTypeIds.Store] = "S";
	OutletTypeAbbreviations[OutletTypeIds.VegetarianRestaraunt] = "Vge";
	OutletTypeAbbreviations[OutletTypeIds.VeganRestaraunt] = "Vgn";
	OutletTypeAbbreviations[OutletTypeIds.VegFriendlyRestaraunt] = "VFr";

	function OutletType(data) {
		this.id = data.id;
		this.name = OutletTypeNames[this.id] || "";
		this.abbreviation = OutletTypeAbbreviations[this.id] || "?";
	}

	OutletType.fromHappyCow = function (data) {
		var isStore = parseInt(data.type) === 2,
			isVegetarian = parseInt(data.vegonly) === 1,
			isVegan = parseInt(data.vegan) === 1,
			id = OutletTypeIds.Unknown;

		if (isStore) {
			id = OutletTypeIds.Store;
		} else if (isVegetarian) {
			if (isVegan) {
				id = OutletTypeIds.VeganRestaraunt;
			} else {
				id = OutletTypeIds.VegetarianRestaraunt;
			}
		} else {
			id = OutletTypeIds.VegFriendlyRestaraunt;
		}

		return new OutletType({ id: id });
	};

	return OutletType;
});