import { z } from 'zod'

export default z.object({
  name: z.string().min(1, 'Please enter color name'),
  value: z
    .string()
    .min(1, 'Please enter color value')
    .refine(
      (color) =>
        /^#(?:[0-9A-F]{3}){1,2}$/i.test(color) || // HEX
        /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/i.test(color) || // RGB
        /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (?:0|1|0?\.\d+)\)$/i.test(color) || // RGBA
        /^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/i.test(color) || // HSL
        /^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (?:0|1|0?\.\d+)\)$/i.test(color), // HSLA
      { message: 'Invalid color format' },
    ),
})
