const VEGKART = "https://vegkart.atlas.vegvesen.no/#";
const MORE_OG_ROMSDAL = 15;

function hva(id: number) {
  return `hva:hva%5B0%5D%5BabsoluteIntervals%5D=false&hva%5B0%5D%5Bid%5D=${id}`;
}

export function vegkartHeleNorge(id: number) {
  return `${VEGKART}/@600000,7185971,3/${hva(id)}`;
}

export function vegkartMoreOgRomsdal(id: number) {
  return `${VEGKART}/@93867,6993453,6/${hva(id)}/hvor:fylke%5B0%5D=${MORE_OG_ROMSDAL}`;
}
