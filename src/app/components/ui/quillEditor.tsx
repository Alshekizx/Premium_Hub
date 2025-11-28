'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// ✅ Dynamically import ReactQuill only on client
const ReactQuill = dynamic(async () => {
  const RQ = (await import('react-quill-new')).default;
  const { Quill } = await import('react-quill-new');

  if (Quill && !Quill.imports['formats/list']) {
    try {
      const Block = Quill.import('blots/block');
      const List = Quill.import('formats/list') || Quill.import('formats/list/list');
      const Align = Quill.import('attributors/class/align');
      const Direction = Quill.import('attributors/class/direction');
      const Background = Quill.import('attributors/class/background');
      const Color = Quill.import('attributors/class/color');
      const Size = Quill.import('attributors/class/size');

      Quill.register('blots/block', Block, true);
      if (List) Quill.register('formats/list', List, true);
      Quill.register('attributors/class/align', Align, true);
      Quill.register('attributors/class/direction', Direction, true);
      Quill.register('attributors/class/background', Background, true);
      Quill.register('attributors/class/color', Color, true);
      Quill.register('attributors/class/size', Size, true);
    } catch (err) {
      console.warn('Quill format registration issue:', err);
    }
  }

  return RQ;
}, { ssr: false });

export default function QuillEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  // ✅ Async mount to avoid “setState in effect” warning
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'color',
    'background',
    'link',
    'blockquote',
    'code-block',
  ];

  if (!mounted)
    return <div className="min-h-[200px] border rounded-md bg-gray-50" />;

  return (
    <div suppressHydrationWarning>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
}
