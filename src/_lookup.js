export const dict = {
	mg: "margin",
	pd: "padding",
	bd: "border",
	bg: "background",
	cl: "color",
	d: "display",
	p: "position"
}

export function lookup ( prop ) {
	let nProp = dict[prop]

	return nProp || prop
}
