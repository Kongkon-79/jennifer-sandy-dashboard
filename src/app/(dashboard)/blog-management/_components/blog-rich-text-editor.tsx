"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent,
} from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Pilcrow,
  Redo2,
  Underline,
  Undo2,
  Type,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BlogRichTextEditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

type SelectedImageState = {
  width: number;
  height: number;
  left: number;
  top: number;
};

const fontSizes = [
  { label: "12px", value: "1" },
  { label: "14px", value: "2" },
  { label: "16px", value: "3" },
  { label: "18px", value: "4" },
  { label: "24px", value: "5" },
  { label: "32px", value: "6" },
  { label: "48px", value: "7" },
];

const isContentEmpty = (html: string) => {
  const strippedText = html
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim();

  return strippedText.length === 0 && !/<img\b/i.test(html);
};

const BlogRichTextEditor = ({
  initialValue = "",
  onChange,
  placeholder = "Description here",
}: BlogRichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);
  const resizeStateRef = useRef<{
    mode: "both" | "width" | "height";
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const hasAppliedInitialValueRef = useRef(false);
  const [hasContent, setHasContent] = useState(Boolean(initialValue.trim()));
  const [selectedImage, setSelectedImage] = useState<SelectedImageState | null>(
    null,
  );

  useEffect(() => {
    if (!editorRef.current || hasAppliedInitialValueRef.current) {
      return;
    }

    editorRef.current.innerHTML = initialValue;
    setHasContent(!isContentEmpty(initialValue));
    onChange?.(initialValue);
    hasAppliedInitialValueRef.current = true;
  }, [initialValue, onChange]);

  const syncEditorValue = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setHasContent(!isContentEmpty(html));
    onChange?.(html);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      savedRangeRef.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  };

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    syncEditorValue();
  };

  const applyFontSize = (value: string) => {
    if (!value) {
      return;
    }

    runCommand("fontSize", value);
  };

  const applyBlock = (value: string) => {
    runCommand("formatBlock", value);
  };

  const applyTextColor = (event: ChangeEvent<HTMLInputElement>) => {
    runCommand("foreColor", event.target.value);
  };

  const handleLinkInsert = () => {
    const url = window.prompt("Enter the link URL");
    if (!url) {
      return;
    }

    runCommand("createLink", url);
  };

  const insertImageIntoEditor = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      editorRef.current?.focus();
      restoreSelection();

      const imageMarkup = `
        <img
          src="${reader.result}"
          alt="${file.name}"
          style="width: 320px; max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 12px 0;"
          data-blog-editor-image="true"
        />
      `;

      document.execCommand("insertHTML", false, imageMarkup);
      syncEditorValue();
    };

    reader.readAsDataURL(file);
  };

  const handleEditorImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      insertImageIntoEditor(file);
    }

    event.target.value = "";
  };

  const updateSelectedImage = (patch: Partial<SelectedImageState>) => {
    if (!selectedImageRef.current) {
      return;
    }

    const currentWidth =
      selectedImageRef.current.getBoundingClientRect().width ||
      selectedImageRef.current.width ||
      320;
    const currentHeight =
      selectedImageRef.current.getBoundingClientRect().height ||
      selectedImageRef.current.height ||
      200;
    const nextWidth = patch.width ?? Math.round(currentWidth);
    const nextHeight = patch.height ?? Math.round(currentHeight);

    selectedImageRef.current.style.width = `${Math.max(48, nextWidth)}px`;
    selectedImageRef.current.style.height = `${Math.max(48, nextHeight)}px`;
    selectedImageRef.current.style.maxWidth = "100%";
    selectedImageRef.current.style.objectFit = "contain";

    setSelectedImage((currentSelectedImage) => ({
      left: currentSelectedImage?.left ?? 0,
      top: currentSelectedImage?.top ?? 0,
      width: Math.max(48, nextWidth),
      height: Math.max(48, nextHeight),
    }));
    syncEditorValue();
  };

  const handleEditorClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.tagName === "IMG") {
      const imageElement = target as HTMLImageElement;
      const width =
        imageElement.getBoundingClientRect().width || imageElement.width || 320;
      const height =
        imageElement.getBoundingClientRect().height ||
        imageElement.height ||
        200;
      const rect = imageElement.getBoundingClientRect();
      const wrapperRect =
        editorWrapperRef.current?.getBoundingClientRect() ?? rect;

      selectedImageRef.current = imageElement;
      setSelectedImage({
        width: Math.round(width),
        height: Math.round(height),
        left: Math.round(rect.left - wrapperRect.left),
        top: Math.round(rect.top - wrapperRect.top),
      });
      return;
    }

    selectedImageRef.current = null;
    setSelectedImage(null);
  };

  const startResize = (
    mode: "both" | "width" | "height",
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedImageRef.current) {
      return;
    }

    resizeStateRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: selectedImageRef.current.getBoundingClientRect().width || 320,
      startHeight: selectedImageRef.current.getBoundingClientRect().height || 200,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!resizeStateRef.current || !selectedImageRef.current) {
        return;
      }

      const deltaX = moveEvent.clientX - resizeStateRef.current.startX;
      const deltaY = moveEvent.clientY - resizeStateRef.current.startY;
      const aspectRatio =
        resizeStateRef.current.startWidth / resizeStateRef.current.startHeight;

      let nextWidth = resizeStateRef.current.startWidth;
      let nextHeight = resizeStateRef.current.startHeight;

      if (resizeStateRef.current.mode === "width") {
        nextWidth = resizeStateRef.current.startWidth + deltaX;
        nextHeight = nextWidth / aspectRatio;
      } else if (resizeStateRef.current.mode === "height") {
        nextHeight = resizeStateRef.current.startHeight + deltaY;
        nextWidth = nextHeight * aspectRatio;
      } else {
        nextWidth = resizeStateRef.current.startWidth + deltaX;
        nextHeight = resizeStateRef.current.startHeight + deltaY;
      }

      const clampedWidth = Math.max(48, Math.round(nextWidth));
      const clampedHeight = Math.max(48, Math.round(nextHeight));

      selectedImageRef.current.style.width = `${clampedWidth}px`;
      selectedImageRef.current.style.height = `${clampedHeight}px`;
      selectedImageRef.current.style.maxWidth = "100%";
      selectedImageRef.current.style.objectFit = "contain";

      setSelectedImage({
        width: clampedWidth,
        height: clampedHeight,
        left:
          selectedImageRef.current.getBoundingClientRect().left -
          (editorWrapperRef.current?.getBoundingClientRect().left ?? 0),
        top:
          selectedImageRef.current.getBoundingClientRect().top -
          (editorWrapperRef.current?.getBoundingClientRect().top ?? 0),
      });
      syncEditorValue();
    };

    const stopResize = () => {
      resizeStateRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
  };

  return (
    <div className="rounded-[8px] border border-[#D9D9D9] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E6E7E6] px-3 py-2">
        <Select onValueChange={applyFontSize} defaultValue="3">
          <SelectTrigger className="h-9 w-[110px] rounded-[6px] border-[#E6E7E6] bg-[#F8F9FA] text-xs text-[#343A40] shadow-none">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <SelectValue placeholder="Size" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white">
            {fontSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={applyBlock} defaultValue="p">
          <SelectTrigger className="h-9 w-[118px] rounded-[6px] border-[#E6E7E6] bg-[#F8F9FA] text-xs text-[#343A40] shadow-none">
            <div className="flex items-center gap-2">
              <Pilcrow className="h-4 w-4" />
              <SelectValue placeholder="Block" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => runCommand("bold")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("italic")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("underline")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("insertUnorderedList")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Bulleted list"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("insertOrderedList")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("justifyLeft")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("justifyCenter")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("justifyRight")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleLinkInsert}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Insert link"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Insert image"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("undo")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => runCommand("redo")}
          className="rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] p-2 text-[#343A40] transition-colors hover:bg-[#E6F2FD]"
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>
        <label
          className="flex h-9 items-center gap-2 rounded-[6px] border border-[#E6E7E6] bg-[#F8F9FA] px-2 text-xs text-[#343A40]"
          aria-label="Text color"
        >
          <Palette className="h-4 w-4" />
          <input
            type="color"
            className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            onChange={applyTextColor}
            defaultValue="#000000"
          />
        </label>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleEditorImageSelect}
        />
      </div>

      {selectedImage && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[#E6E7E6] bg-[#FAFAFA] px-3 py-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[#68706A]">
            Image size
          </span>
          <label className="flex items-center gap-2 text-xs text-[#343A40]">
            W
            <input
              type="number"
              min={48}
              value={selectedImage.width}
              onChange={(event) =>
                updateSelectedImage({ width: Number(event.target.value) })
              }
              className="h-8 w-20 rounded-[6px] border border-[#D9D9D9] px-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-[#343A40]">
            H
            <input
              type="number"
              min={48}
              value={selectedImage.height}
              onChange={(event) =>
                updateSelectedImage({ height: Number(event.target.value) })
              }
              className="h-8 w-20 rounded-[6px] border border-[#D9D9D9] px-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            type="button"
            onClick={() =>
              selectedImageRef.current &&
              updateSelectedImage({
                width: 320,
                height:
                  Math.round(
                    (selectedImage.height / selectedImage.width) * 320,
                  ) || 200,
              })
            }
            className="rounded-[6px] border border-[#D9D9D9] bg-white px-3 py-1.5 text-xs font-medium text-[#343A40] hover:bg-[#F3F4F6]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              if (!selectedImageRef.current) return;
              selectedImageRef.current.remove();
              selectedImageRef.current = null;
              setSelectedImage(null);
              syncEditorValue();
            }}
            className="rounded-[6px] border border-[#FF5A5F] bg-white px-3 py-1.5 text-xs font-medium text-[#FF5A5F] hover:bg-[#FFF5F5]"
          >
            Remove
          </button>
        </div>
      )}

      <div ref={editorWrapperRef} className="relative">
        {!hasContent && (
          <span className="pointer-events-none absolute left-4 top-3 text-sm text-[#9CA3AF]">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          suppressContentEditableWarning
          className={cn(
            "min-h-[260px] max-h-[500px] overflow-y-auto rounded-b-[8px] px-4 py-3 text-sm leading-7 text-[#343A40] outline-none break-words",
            "[&_*]:break-words [&_*]:overflow-wrap-break-word",
            "[&>h1]:mb-3 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:mb-3 [&>h2]:text-2xl [&>h2]:font-semibold [&>p]:mb-3 [&>p]:leading-7 [&>ul]:mb-3 [&>ol]:mb-3 [&>ul>li]:ml-5 [&>ol>li]:ml-5 [&>img]:max-w-full [&>img]:cursor-pointer",
            "[&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_a]:break-all",
            "[&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#D9D9D9] [&_td]:p-2 [&_th]:border [&_th]:border-[#D9D9D9] [&_th]:p-2"
          )}
          onInput={syncEditorValue}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onBlur={saveSelection}
          onClick={handleEditorClick}
        />

        {selectedImage && (
          <div
            className="pointer-events-none absolute z-10 rounded-[10px] border-2 border-primary"
            style={{
              left: selectedImage.left - 2,
              top: selectedImage.top - 2,
              width: selectedImage.width + 4,
              height: selectedImage.height + 4,
            }}
          >
            <button
              type="button"
              aria-label="Resize width and height"
              onPointerDown={(event) => startResize("both", event)}
              className="pointer-events-auto absolute -right-2 -bottom-2 h-4 w-4 cursor-nwse-resize rounded-full border border-white bg-primary shadow-md"
            />
            <button
              type="button"
              aria-label="Resize width"
              onPointerDown={(event) => startResize("width", event)}
              className="pointer-events-auto absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 cursor-ew-resize rounded-full border border-white bg-primary shadow-md"
            />
            <button
              type="button"
              aria-label="Resize height"
              onPointerDown={(event) => startResize("height", event)}
              className="pointer-events-auto absolute left-1/2 -bottom-2 h-4 w-4 -translate-x-1/2 cursor-ns-resize rounded-full border border-white bg-primary shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogRichTextEditor;
