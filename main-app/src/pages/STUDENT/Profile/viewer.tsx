import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { AddressLocator, profileBG } from "../../../assets";
import { Avatar, Spin } from "antd";
import { useParams } from "react-router-dom";
import { ClientRequest } from "../../../requests";
import { UserProps, useAlert } from "../../../store";
import { getAvatar } from "../../../utils/helperFunction";

const ReadOnlyProfile: React.FC = () => {
  const { id } = useParams();
  const { onFailure } = useAlert();
  const [data, setData] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res: any = id ? await ClientRequest.getUserById(Number(id)) : await ClientRequest.getMe();
        // Normalize potential wrapped shapes: AxiosResponse-like, { data: obj }, or raw obj
        const normalized: any = (res && typeof res === 'object')
          ? (res.data && typeof res.data === 'object' && (res.data.email || res.data.id || res.data.full_name)
              ? res.data
              : res)
          : null;
        if (active) setData(normalized);
      } catch (e: any) {
        onFailure(e?.message || "Failed to load profile");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, onFailure]);

  const display = data;

  return (
    <Layout loading={loading}>
      <div className="w-[90%] md-920:w-4/5 mx-auto profile">
        {loading ? (
          <div className="flex justify-center items-center py-16"><Spin /></div>
        ) : (
          <>
            {/* Cover + Avatar + Header */}
            <div className="relative">
              <img
                alt="cover"
                src={(display?.cover_photo as string) || profileBG}
                className="h-[120px] sm:h-[200px] w-full object-cover rounded-md"
              />
              <div className="flex justify-between sm:flex-row flex-col">
                <div className="mb-3 relative flex gap-2 bottom-[15px] left-[30px] md-920:left-[100px] ">
                  <Avatar
                    size={64}
                    className="border-4 border-solid border-white"
                    src={getAvatar(display?.profile_image as string)}
                    alt="Profile Image"
                  />
                  <div className="flex flex-col gap-y-1">
                    <h2 className="text-[16px] font-medium mt-[18px]">
                      {display?.full_name || display?.email}
                    </h2>
                    {display?.email && (
                      <span className="text-[14px] text-[#666666] block">{display.email}</span>
                    )}
                    {display?.phone_number && (
                      <a
                        href={`tel:${display.phone_number}`}
                        className="text-[14px] text-[#666666] block"
                      >
                        {display.phone_number}
                      </a>
                    )}
                    <p className="text-[#808080] flex gap-2 items-center text-[14px] ">
                      <AddressLocator />
                      {(() => {
                        const country = display?.location?.country_region;
                        const city = display?.location?.city;
                        return (country || city)
                          ? `${country || ""}${city ? `, ${city}` : ""}`
                          : "Location";
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact info */}
            {(display?.email || (display && Object.prototype.hasOwnProperty.call(display, 'phone_number'))) && (
              <section className="my-[20px]">
                <h3 className="mb-[10px] text-[20px] font-semibold">Contact info</h3>
                <div className="text-[#666666] text-[16px] flex flex-col gap-1">
                  {display?.email && <div><span className="text-[#121212] font-medium">Email:</span> {display.email}</div>}
                  {display && Object.prototype.hasOwnProperty.call(display, 'phone_number') && (
                    <div>
                      <span className="text-[#121212] font-medium">Phone:</span>{' '}
                      {display?.phone_number ? (
                        <a href={`tel:${display.phone_number}`}>{display.phone_number}</a>
                      ) : (
                        '—'
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* About */}
            <section className="my-[28px]">
              <h3 className="mb-[10px] text-[24px] font-semibold">About</h3>
              <div className="text-[#666666] text-[16px]">
                {display?.bio ? <div className="mt-1">{display.bio}</div> : <div>—</div>}
              </div>
            </section>

            {/* Location */}
            <section className="my-[28px]">
              <h3 className="mb-[10px] text-[24px] font-semibold">Location</h3>
              <div className="text-[#666666] text-[16px]">
                {(() => {
                  const country = display?.location?.country_region;
                  const city = display?.location?.city;
                  return (country || city)
                    ? `${country || ""}${city ? `, ${city}` : ""}`
                    : "—";
                })()}
              </div>
            </section>

            {/* Education */}
            <section className="my-[28px]">
              <h3 className="mb-[10px] text-[24px] font-semibold">Education</h3>
              <div className="text-[#666666] text-[16px] flex flex-col gap-3">
                {(display?.education || []).length ? (
                  (display?.education || []).map((e: any, idx: number) => (
                    <div key={idx} className="leading-snug">
                      {e?.school && <div>{e.school}</div>}
                      {e?.degree && <div className="text-[#808080]">{e.degree}</div>}
                      {e?.field_of_study && <div className="text-[#808080]">{e.field_of_study}</div>}
                      {(e?.start_date || e?.end_date) && (
                        <div className="text-[#9A9A9A] text-[14px]">{e?.start_date || "—"} - {e?.end_date || "Present"}</div>
                      )}
                      {!e?.school && !e?.degree && !e?.field_of_study && !e?.start_date && !e?.end_date && <div>—</div>}
                    </div>
                  ))
                ) : (
                  <div>—</div>
                )}
              </div>
            </section>

            {/* Work Experience */}
            <section className="my-[28px]">
              <h3 className="mb-[10px] text-[24px] font-semibold">Work Experience</h3>
              <div className="text-[#666666] text-[16px] flex flex-col gap-3">
                {(display?.work_experience || []).length ? (
                  (display?.work_experience || []).map((w: any, idx: number) => (
                    <div key={idx} className="leading-snug">
                      {w?.company && <div>{w.company}</div>}
                      {w?.role_title && <div className="text-[#808080]">{w.role_title}</div>}
                      {w?.job_description && <div className="text-[#808080]">{w.job_description}</div>}
                      {(w?.start_date || w?.end_date) && (
                        <div className="text-[#9A9A9A] text-[14px]">{w?.start_date || "—"} - {w?.end_date || "Present"}</div>
                      )}
                      {!w?.company && !w?.role_title && !w?.job_description && !w?.start_date && !w?.end_date && <div>—</div>}
                    </div>
                  ))
                ) : (
                  <div>—</div>
                )}
              </div>
            </section>

            {/* Licenses and Certifications */}
            <section className="my-[28px]">
              <h3 className="mb-[10px] text-[24px] font-semibold">Licenses and Certifications</h3>
              <div className="text-[#666666] text-[16px] flex flex-col gap-3">
                {(display?.licenses_certifications || []).length ? (
                  (display?.licenses_certifications || []).map((l: any, idx: number) => (
                    <div key={idx} className="leading-snug">
                      {l?.name && <div>{l.name}</div>}
                      {l?.issuing_organization && <div className="text-[#808080]">{l.issuing_organization}</div>}
                      {l?.credential_id && <div className="text-[#808080]">{l.credential_id}</div>}
                      {(l?.issue_date || l?.expiration_date) && (
                        <div className="text-[#9A9A9A] text-[14px]">{l?.issue_date || "—"} - {l?.expiration_date || "—"}</div>
                      )}
                      {l?.credential_url && <div className="text-[#808080] break-all">{l.credential_url}</div>}
                      {!l?.name && !l?.issuing_organization && !l?.credential_id && !l?.issue_date && !l?.expiration_date && !l?.credential_url && <div>—</div>}
                    </div>
                  ))
                ) : (
                  <div>—</div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ReadOnlyProfile;
