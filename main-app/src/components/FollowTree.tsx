import React, { useMemo, useState, useEffect, useRef } from "react";
// custom visual-only checkbox used instead of antd's Checkbox to match design
import { RightOutlined, DownOutlined } from "@ant-design/icons";

type TreeNode = {
  id?: number | null;
  label?: string;
  name?: string;
  title?: string;
  selectable?: boolean;
  children?: TreeNode[];
};

type Props = {
  nodes: TreeNode[];
  checkedIds?: number[];
  onChange?: (ids: number[]) => void;
  // Render the whole tree inside a compact dropdown-like collapsible box
  asDropdown?: boolean;
  // Placeholder text shown when nothing is selected (used for dropdown header)
  placeholder?: string;
  // Optional header title to display above the selected items
  title?: string;
};

export default function FollowTree({ nodes, checkedIds = [], onChange, asDropdown = false, placeholder = "Select...", title }: Props) {
  const checkedSet = useMemo(() => new Set(checkedIds || []), [checkedIds]);

  const countLeaves = (n: TreeNode): { total: number; checked: number } => {
    if (!n) return { total: 0, checked: 0 };
    if (n.selectable === true || (n.id != null && !Array.isArray(n.children))) {
      const id = n.id as number | undefined;
      return { total: id ? 1 : 0, checked: id && checkedSet.has(id) ? 1 : 0 };
    }
    let total = 0, checked = 0;
  (n.children || []).forEach((c) => {
      const r = countLeaves(c);
      total += r.total;
      checked += r.checked;
    });
    return { total, checked };
  };

  const toggle = (id?: number | null) => {
    if (!id) {
      console.warn("FollowTree: skip toggle, missing id", id);
      return;
    }
    const next = new Set(checkedSet);
    if (next.has(id)) next.delete(id); else next.add(id);
    onChange?.(Array.from(next));
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // close dropdown when clicking outside
  useEffect(() => {
    if (!asDropdown) return;
    const onDocClick = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [asDropdown]);

  // helper to find label by id from nodes tree
  const findLabelById = (id?: number | null): string | null => {
    if (id == null) return null;
    let found: string | null = null;
    const walk = (arr: TreeNode[] | undefined) => {
      (arr || []).forEach((n) => {
        if (found) return;
        if (!n) return;
        if ((n.id != null && n.id === id) || (n.selectable === true && n.id === id)) {
          found = n.label ?? n.name ?? n.title ?? String(n.id);
          return;
        }
        if (Array.isArray(n.children)) walk(n.children);
      });
    };
    walk(nodes);
    return found;
  };

  const NodeItem: React.FC<{ node: TreeNode; depth?: number }> = ({ node, depth = 0 }) => {
    if (!node) return null;
    const label = node.label ?? node.name ?? node.title ?? "Untitled";
    const isLeaf = node.selectable === true || (node.id != null && !Array.isArray(node.children));
    const padding = { paddingLeft: depth * 12 } as React.CSSProperties;

    if (isLeaf) {
      const id = node.id;
      const checked = !!(id != null && checkedSet.has(id));

      // inline styles to avoid touching global css; purely visual changes
      const btnStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        minWidth: 20,
        borderRadius: 4,
        border: '1px solid #cfcfcf',
        background: checked ? '#222' : '#fff',
        cursor: 'pointer',
        transition: 'all 120ms ease',
        boxSizing: 'border-box',
      };

      const checkMarkStyle: React.CSSProperties = {
        width: 12,
        height: 12,
        display: 'block',
        color: '#fff',
      };

      const labelStyle: React.CSSProperties = { marginLeft: 6 };

      const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle(id);
        }
      };

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...padding }}>
          <div
            role="checkbox"
            tabIndex={0}
            aria-checked={checked}
            title={label}
            onClick={() => toggle(id)}
            onKeyDown={onKeyDown}
            style={btnStyle}
          >
            {checked ? (
              <svg viewBox="0 0 24 24" fill="none" style={checkMarkStyle} aria-hidden>
                <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </div>
          <div style={labelStyle}>{label}</div>
        </div>
      );
    }

    const [open, setOpen] = useState(false);
    const { total, checked } = countLeaves(node);
    const indeterminate = checked > 0 && checked < total;

    return (
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...padding }}>
          <div style={{ width: 18, cursor: 'pointer' }} onClick={() => setOpen((s) => !s)}>
            {open ? <DownOutlined /> : <RightOutlined />}
          </div>
          <div style={{ fontWeight: 600 }}>{label}</div>
          {total > 0 && (
            <div style={{ marginLeft: 8, color: indeterminate ? '#1890ff' : '#999', fontSize: 12 }}>
              {indeterminate ? '• partial' : checked > 0 ? `${checked}/${total}` : null}
            </div>
          )}
        </div>
        {open && (
          <div style={{ marginTop: 6 }}>
            {(node.children || []).map((c, idx) => (
              <NodeItem key={c.id ?? `${idx}-${String(c.label ?? c.name ?? c.title)}`} node={c} depth={(depth || 0) + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // If dropdown mode is requested, render a compact header showing selected labels and toggle the tree
  if (asDropdown) {
    const selected = (checkedIds || []).map((id) => findLabelById(id) || String(id));
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      padding: '8px 10px',
      border: '1px solid #e6e6e6',
      borderRadius: 6,
      cursor: 'pointer',
      background: '#fff',
    };
    const chipStyle: React.CSSProperties = {
      background: '#f3f4f6',
      padding: '4px 8px',
      borderRadius: 16,
      fontSize: 12,
    };

    return (
      <div ref={containerRef} style={{ position: 'relative' }}>
        {title && <div style={{ marginBottom: 6, fontWeight: 600 }}>{title}</div>}
        <div style={headerStyle} onClick={() => setDropdownOpen((s) => !s)} role="button" tabIndex={0}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', minHeight: 24 }}>
            {selected.length === 0 ? (
              <div style={{ color: '#999' }}>{placeholder}</div>
            ) : (
              selected.slice(0, 3).map((s, idx) => <div key={idx} style={chipStyle}>{s}</div>)
            )}
            {selected.length > 3 && <div style={{ color: '#666', fontSize: 12 }}>{`+${selected.length - 3} more`}</div>}
          </div>
          <div style={{ marginLeft: 8 }}>{dropdownOpen ? <DownOutlined /> : <RightOutlined />}</div>
        </div>
        {dropdownOpen && (
          <div style={{ position: 'absolute', zIndex: 40, width: '100%', marginTop: 8, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, padding: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
            {(nodes || []).map((n, i) => <NodeItem key={n.id ?? i} node={n} />)}
          </div>
        )}
      </div>
    );
  }

  return <div>{(nodes || []).map((n, i) => <NodeItem key={n.id ?? i} node={n} />)}</div>;
}
