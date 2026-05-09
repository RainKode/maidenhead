/**
 * Real image references pulled from Dishoom's Sanity CDN during inspection.
 * Used so the clone shows the same photography rather than placeholders.
 */
const SANITY = "https://cdn.sanity.io/images/daku84np/production";
const fmt = (id: string, rect?: string) =>
  `${SANITY}/${id}.jpg?${rect ? `rect=${rect}&` : ""}fit=max&auto=format`;

export const dishoomImages = {
  hero: fmt("420977e704b1452a4e342a72d341f4993c1bf77e-2560x1706"),
  bMerwan: fmt("42163a6aeb9af4ea764220d37b3fcf7a5f428eac-1706x2560"),
  cardMenus: fmt("e46926c8370959859f5b60b82d0877ec8f5e2da4-1500x1500", "0,0,1500,1257"),
  cardReservations: fmt("1b3e9b04d3be932845f9072b0dd203e0300888e5-3998x2999"),
  cardStore: fmt("2087828fa33a4a832d332a5c52ba3c4517e90ba7-2048x1365"),
  refuge: fmt("ae598090a635b979803cf2d8642675110b333672-2560x1440"),
  comfortLarge: fmt("02890b29ee51048ce3cae85a683e1a0cfec2fb0f-2560x1918"),
  comfortChai: fmt("146f079e742872b0c8744abded07e930615e749f-2560x1440"),
  comfortGrills: fmt("cd69aa62d11d3e8bae5cf0fe422830403a5e2df8-2238x1488"),
  mango: fmt("e980da3e7cbdf47b05a1bcf7532ad445b74a5a79-2560x1707"),
  lambRack: fmt("c4e0b12c320026f98c3764c8ffec5ba54f016ff5-1486x1440"),
  storeHero: fmt("0bc71345c44c07946fc79449d79860314751a559-1920x2560"),
  recipeBiryani: fmt("ce3d719499647588ead34859a3073ae11d6f76c0-1920x2560"),
  recipePotatoes: fmt("3050b7cf850f8b8a74909e05f7dbbb6d454f4b5a-800x1200", "0,189,800,633"),
  recipeChutney: fmt("166e84c9df8561f3fbdb238eff2d7213220baca8-1200x1600"),
  recipeBroccoli: fmt("f5c3854b0467129cff6b90d441db3f7a06101819-800x1200", "0,281,800,690"),
  recipeChaat: fmt("5cc0fb82206c308a20c938dd916292eac886257a-1200x801"),
  fillerLandscape1: fmt("76ee046c5646bade048fce8b89fd18714dc08a9e-1200x840"),
  fillerLandscape2: fmt("44d846b117b2828542395b0bcf57f4f46618fc19-2560x1440"),
};
