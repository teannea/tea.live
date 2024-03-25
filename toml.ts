import fsMod from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type {
  AstroIntegration,
  AstroConfig,
  DataEntryType,
  HookParameters,
} from "astro"
import { AstroError, AstroErrorData } from "astro/errors"
import * as TOML from "@iarna/toml"

type SetupHookParams = HookParameters<"astro:config:setup"> & {
  config: AstroConfig
  addDataEntryType: (dataEntryType: DataEntryType) => void
}

export default function createIntegration(): AstroIntegration {
  return {
    name: "astro-toml",
    hooks: {
      "astro:config:setup": (params) => {
        const { config, addDataEntryType } = params as SetupHookParams
        const { contentDir } = getContentPaths(config)

        addDataEntryType({
          extensions: [".toml"],
          getEntryInfo({ contents, fileUrl }) {
            if (contents === undefined || contents === "") return { data: {} }
            const pathRelToContentDir = path.relative(
              fileURLToPath(contentDir),
              fileURLToPath(fileUrl)
            )
            try {
              const data = TOML.parse(contents)
              // NOTE: Hack because astro or devalue doesn't like symbols keys
              //       in objects, but they are unfortunately produced by @iarana/toml.
              //       So, necessary evil.
              return { data: JSON.parse(JSON.stringify(data)) }
            } catch (e) {
              throw new AstroError({
                ...AstroErrorData.DataCollectionEntryParseError,
                message: AstroErrorData.DataCollectionEntryParseError.message(
                  pathRelToContentDir,
                  e instanceof Error ? e.message : "contains invalid TOML."
                ),
                location: { file: fileUrl.pathname },
                stack: e instanceof Error ? e.stack : undefined,
              })
            }

            if (data == null || typeof data !== "object") {
              throw new AstroError({
                ...AstroErrorData.DataCollectionEntryParseError,
                message: AstroErrorData.DataCollectionEntryParseError.message(
                  pathRelToContentDir,
                  "data is not an object."
                ),
                location: { file: fileUrl.pathname },
              })
            }
          },
        })
      },
    },
  }
}

// TODO: Find a way to import from "astro/src/content"

type ContentPaths = {
  contentDir: URL
  assetsDir: URL
  cacheDir: URL
  typesTemplate: URL
  virtualModTemplate: URL
  config: {
    exists: boolean
    url: URL
  }
}

function getContentPaths(
  { srcDir, root }: Pick<AstroConfig, "root" | "srcDir">,
  fs: typeof fsMod = fsMod
): ContentPaths {
  const configStats = search(fs, srcDir)
  const pkgBase = new URL("../../", import.meta.url)
  return {
    cacheDir: new URL(".astro/", root),
    contentDir: new URL("./content/", srcDir),
    assetsDir: new URL("./assets/", srcDir),
    typesTemplate: new URL("content-types.template.d.ts", pkgBase),
    virtualModTemplate: new URL("content-module.template.mjs", pkgBase),
    config: configStats,
  }
}

function search(fs: typeof fsMod, srcDir: URL) {
  const paths = ["config.mjs", "config.js", "config.mts", "config.ts"].map(
    (p) => new URL(`./content/${p}`, srcDir)
  )
  for (const file of paths) {
    if (fs.existsSync(file)) {
      return { exists: true, url: file }
    }
  }
  return { exists: false, url: paths[0] }
}
