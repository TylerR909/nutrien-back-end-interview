import { createJsWithTsEsmPreset } from "ts-jest";

const tsJestTransformCfg = createJsWithTsEsmPreset();

process.env.DATABASE_URL ??= "postgres://postgres:illnevertell@db:5432/nutrien_test_1";

/** @type {import("jest").Config} **/
export default {
  extensionsToTreatAsEsm: [".ts"],
  ...tsJestTransformCfg,
};
