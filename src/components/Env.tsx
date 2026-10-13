// Numbered lecture-note environments. Numbers ("Example 2.3") come from CSS
// counters in globals.css, so MDX authors only supply an optional name.

type EnvProps = { name?: string; children: React.ReactNode };

function makeEnv(kind: string) {
  function Env({ name, children }: EnvProps) {
    return (
      <div className={`env env-${kind}`}>
        <div className="env-title">
          {name && <span className="env-name">({name})</span>}
        </div>
        {children}
      </div>
    );
  }
  Env.displayName = kind;
  return Env;
}

export const Definition = makeEnv("definition");
export const Example = makeEnv("example");
export const Remark = makeEnv("remark");
export const Result = makeEnv("theorem");
