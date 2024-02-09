#!/usr/bin/env -S deno run --allow-all

import * as colors from "https://deno.land/std@0.215.0/fmt/colors.ts";
import { build$, CommandBuilder } from "https://deno.land/x/dax@0.39.0/mod.ts";

const $ = build$({ commandBuilder: new CommandBuilder().noThrow() });

export type ReportResult = {
  readonly ok: string;
} | {
  readonly warn: string;
} | {
  readonly suggest: string;
};

export interface DoctorReporter {
  (
    args: ReportResult | {
      test: () => ReportResult | Promise<ReportResult>;
    },
  ): Promise<void>;
}

export interface DoctorDiagnostic {
  readonly diagnose: (report: DoctorReporter) => Promise<void>;
}

export interface DoctorCategory {
  readonly label: string;
  readonly diagnostics: () => Generator<DoctorDiagnostic, void>;
}

export function doctorCategory(
  label: string,
  diagnostics: () => Generator<DoctorDiagnostic, void>,
): DoctorCategory {
  return {
    label,
    diagnostics,
  };
}

export function denoDoctor(): DoctorCategory {
  return doctorCategory("Deno", function* () {
    const deno: DoctorDiagnostic = {
      diagnose: async (report: DoctorReporter) => {
        report({ ok: (await $`deno --version`.lines())[0] });
      },
    };
    yield deno;
  });
}

/**
 * Doctor task legend:
 * - 🚫 is used to indicate a warning or error and should be corrected
 * - 💡 is used to indicate an (optional) _suggestion_
 * - 🆗 is used to indicate success
 * @param categories
 * @returns
 */
export function doctor(categories: () => Generator<DoctorCategory>) {
  // deno-lint-ignore require-await
  const report = async (options: ReportResult) => {
    if ("ok" in options) {
      console.info("  🆗", colors.green(options.ok));
    } else if ("suggest" in options) {
      console.info("  💡", colors.yellow(options.suggest));
    } else {
      console.warn("  🚫", colors.brightRed(options.warn));
    }
  };

  return async () => {
    for (const cat of categories()) {
      console.info(colors.dim(cat.label));
      for (const diag of cat.diagnostics()) {
        await diag.diagnose(async (options) => {
          if ("test" in options) {
            try {
              report(await options.test());
            } catch (err) {
              report({ warn: err.toString() });
            }
          } else {
            report(options);
          }
        });
      }
    }
  };
}

export const checkup = doctor(function* () {
  yield doctorCategory("Build dependencies", function* () {
    yield {
      diagnose: async (report) => {
        await report({
          test: async () => (await $.commandExists("git")
            ? { ok: `Git ${(await $`git --version`.lines())[0]}` }
            : { suggest: "Git not found in PATH, install it" }),
        });
      },
    };
    yield* denoDoctor().diagnostics();
  });
});

if (import.meta.main) {
  await checkup();
}
