import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                "primary": "#3b50ea",
                "secondary": "#4d618a",
                "selected": "#e6eef9",
                "hovered": "#f4f6f9",
            }
        }
    }
}