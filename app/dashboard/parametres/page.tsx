import { requireCapability } from "@/lib/dash-auth";
import { getSiteSettings } from "@/lib/settings";
import { PageTitle } from "@/components/dashboard/page-title";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site-config";
import { updateSiteSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireCapability("settings.manage");
  const settings = await getSiteSettings();

  return (
    <>
      <PageTitle title="Parametres" description="Configuration generale de la plateforme." />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SettingsForm initial={settings} action={updateSiteSettings} />

        <Card className="h-fit p-5">
          <h3 className="flex items-center gap-2 font-heading font-bold text-ink">
            <Icon name="Info" size={17} className="text-digital-purple" />
            Plateforme
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Organisation</dt>
              <dd className="text-right font-medium text-ink">{siteConfig.name}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Version</dt>
              <dd className="font-medium text-ink">1.0.0</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-xl bg-digital-purple/5 p-3 text-xs text-digital-purple">
            {siteConfig.digitalAccess.creditPrivate}
          </div>
        </Card>
      </div>
    </>
  );
}
