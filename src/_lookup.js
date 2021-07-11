export const dict = {
	bd: "border",
	"bd-r": "border-radius", 
	bg: "background",
	cl: "color",
	d: "display",
	h: "height",
	mg: "margin",
	p: "position",
	pd: "padding",
	w: "width",
}

export function lookup ( prop ) {
	return dict[prop] || prop
}
