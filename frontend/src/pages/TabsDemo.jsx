import { DefaultDemo, CustomColorDemo } from '@/components/ui/demo';

export default function TabsDemo() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Demo ExpandableTabs
      </h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Komponen tab shadcn yang melebar (expand) saat dipilih.
      </p>
      <div className="mt-8 space-y-10">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
            Default
          </h2>
          <DefaultDemo />
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
            Warna kustom
          </h2>
          <CustomColorDemo />
        </section>
      </div>
    </div>
  );
}
