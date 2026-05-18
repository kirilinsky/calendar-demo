import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import { Children, isValidElement, type ReactElement } from "react";
import { CodeBlock } from "./app/docs/CodeBlock";

type CodeChildProps = {
  className?: string;
  children?: React.ReactNode;
};

function headingClass(level: 1 | 2 | 3 | 4) {
  if (level === 1) {
    return "mb-5 scroll-mt-24 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl";
  }
  if (level === 2) {
    return "mb-5 mt-14 scroll-mt-24 border-b border-[var(--border)] pb-3 text-xl font-semibold tracking-tight text-[var(--text-primary)]";
  }
  if (level === 3) {
    return "mb-4 mt-9 scroll-mt-24 text-base font-semibold text-[var(--text-primary)]";
  }
  return "mb-3 mt-7 scroll-mt-24 text-sm font-semibold text-[var(--text-primary)]";
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className={headingClass(1)} {...props} />,
    h2: (props) => <h2 className={headingClass(2)} {...props} />,
    h3: (props) => <h3 className={headingClass(3)} {...props} />,
    h4: (props) => <h4 className={headingClass(4)} {...props} />,
    p: (props) => (
      <p
        className="mb-5 max-w-3xl text-[15px] leading-7 text-[var(--text-secondary)]"
        {...props}
      />
    ),
    a: ({ href = "", children, ...rest }) => {
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="text-[var(--sky)] underline decoration-[var(--border)] underline-offset-4 transition hover:text-[var(--text-primary)]"
          {...rest}
        >
          {children}
        </a>
      );
    },
    strong: (props) => (
      <strong
        className="font-semibold text-[var(--text-primary)]"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="mb-6 max-w-3xl space-y-2 pl-5 text-[15px] leading-7 text-[var(--text-secondary)] marker:text-[var(--emerald)]"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mb-6 max-w-3xl list-decimal space-y-2 pl-5 text-[15px] leading-7 text-[var(--text-secondary)] marker:text-[var(--emerald)]"
        {...props}
      />
    ),
    li: (props) => <li className="list-disc" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="mb-6 max-w-3xl rounded-lg border border-[var(--nav-active-border)] bg-[var(--nav-active)] px-4 py-3 text-[15px] leading-7 text-[var(--text-secondary)]"
        {...props}
      />
    ),
    hr: () => <hr className="my-8 border-[var(--border)]" />,
    img: ({ src = "", alt = "", ...rest }) => (
      <span className="mb-8 mt-6 block">
        <Image
          src={src as ImageProps["src"]}
          alt={alt}
          width={900}
          height={500}
          className="w-full max-w-3xl rounded-none object-contain"
          unoptimized
          {...(rest as Omit<ImageProps, "src" | "alt" | "width" | "height">)}
        />
      </span>
    ),
    table: (props) => (
      <div className="mb-7 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--doc-bg-secondary)] shadow-sm [&_table]:w-full [&_table]:min-w-[680px] [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm">
        <table {...props} />
      </div>
    ),
    thead: (props) => (
      <thead
        className="bg-[var(--nav-active)] text-[var(--text-primary)]"
        {...props}
      />
    ),
    tbody: (props) => (
      <tbody className="text-[var(--text-secondary)]" {...props} />
    ),
    tr: (props) => (
      <tr
        className="border-b border-[var(--border)] last:border-0"
        {...props}
      />
    ),
    th: (props) => (
      <th
        className="border-b border-[var(--border)] px-3 py-2 font-mono text-xs font-medium"
        {...props}
      />
    ),
    td: (props) => (
      <td className="px-3 py-2 align-top leading-6" {...props} />
    ),
    code: ({ className, children, ...rest }) => {
      if (className?.startsWith("language-")) {
        return (
          <code className={className} {...rest}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--doc-bg-secondary)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--emerald)]"
          {...rest}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => {
      const child = Children.toArray(children).find((node) =>
        isValidElement(node),
      ) as ReactElement<CodeChildProps> | undefined;
      const className = child?.props.className ?? "";
      const lang = className.replace(/^language-/, "");
      const code = String(child?.props.children ?? "").replace(/\n$/, "");
      return <CodeBlock code={code} lang={lang} />;
    },
    ...components,
  };
}
