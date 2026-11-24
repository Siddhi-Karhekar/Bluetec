import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Copy is written naturally ("we'd love to") — React escapes it safely.
      "react/no-unescaped-entities": "off",
      // Photos are pre-optimised static files rendered with plain <img> to match the original markup.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"] },
];

export default eslintConfig;
