function land(world, arable, meat_past, agriculture) {

    // year of the shown data
    const year_chosen = 2015;

    /***** processing data *****/

    var data_world = d3.nest()
        .key(d => d.Year)
        .entries(world)
        .filter(d => d.key == year_chosen);
    // console.log(data_world)


    // The share of land area used for agriculture, measured as a percentage of total land area. 
    // Agricultural land refers to the share of land area that is arable, under permanent crops, and under permanent pastures.
    var data_agriculture = d3.nest()
        .key(d => d.Year)
        .entries(agriculture)
        .filter(d => d.key == year_chosen)
    // console.log(data_agriculture)

    // The share of land area used for arable agriculture, measured as a percentage of total land area. Arable land includes
    // land defined by the FAO as land under temporary crops (double-cropped areas are counted once), temporary meadows
    // for mowing or for pasture, land under market or kitchen gardens, and land temporarily fallow.
    var data_arable = d3.nest()
        .key(d => d.Year)
        .entries(arable)
        .filter(d => d.key == year_chosen)
    // console.log(data_arable)

    // Permanent meadows and pastures is defined by the FAO as: "the land used permanently (five years or more) to grow
    // herbaceous forage crops, either cultivated or growing wild (wild prairie or grazing land)."
    var data_meat_past = d3.nest()
        .key(d => d.Year)
        .entries(meat_past)
        .filter(d => d.key == year_chosen)
    // console.log(data_meat_past)



    return {
        world: data_world,
        agriculture: data_agriculture,
        arable: data_arable,
        meat_past: data_meat_past
    }
}