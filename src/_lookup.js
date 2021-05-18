export const dict = {
	bd: "border",
	bg: "background",
	cl: "color",
	d: "display",
	mg: "margin",
	p: "position",
	pd: "padding"
}

export function lookup ( prop ) {
	return dict[prop] || prop
}
