"use client";

import Image from "next/image";
import { useState } from "react";
import { assets } from "@/lib/portfolio-data";
import { ArrowUpRight, Check, Copy, Linkedin, Mail, Sparkles } from "@/components/Icons";
import AppSidebar from "../AppSidebar";

const EMAIL = "taroshmathuria@gmail.com";
const LINKEDIN_URL = "https://linkedin.com/in/tarosh";

export default function ContactApp() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="os-shell">
      <AppSidebar
        title="Mail"
        status="Active now"
        cta={{
          icon: "edit",
          label: "Compose",
          onClick: () => {
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Let's build something")}`;
          },
        }}
        items={[
          { icon: "inbox", label: "Inbox", active: true },
          { icon: "send", label: "Sent" },
          { icon: "draft", label: "Drafts" },
          { icon: "delete", label: "Trash" },
        ]}
        foot={{ initials: "TM", name: "Tarosh Mathuria", role: "Open to work" }}
      />
      <div className="os-main">
        <div className="os-app os-contact">
          <div className="os-contact__hero">
        <div className="os-contact__visual">
          <Image
            src={assets.generated.contact}
            alt="Abstract mail composer and message network"
            width={1672}
            height={941}
          />
        </div>
        <div>
          <span className="os-eyebrow">Get in Touch</span>
          <h1 className="os-app__title">Let&apos;s build something extraordinary.</h1>
        </div>
      </div>

      <div className="os-contact__status">
        <span className="os-contact__pulse"><span /></span>
        Available for select projects &amp; full-time roles
      </div>

      <p className="os-contact__lead">
        Got a production fire, a messy idea, or a system that needs shape? Drop a line — I reply within a day.
      </p>

      <div className="os-contact__cards">
        <div className="os-contact__card">
          <span className="os-contact__icon"><Mail size={20} /></span>
          <a href={`mailto:${EMAIL}`} className="os-contact__text">
            <span className="os-contact__label">Email</span>
            <span className="os-contact__value">{EMAIL}</span>
          </a>
          <button type="button" className={`os-contact__copy ${copied ? "is-done" : ""}`} onClick={copy} aria-label="Copy email">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="os-contact__card">
          <span className="os-contact__icon"><Linkedin size={20} /></span>
          <span className="os-contact__text">
            <span className="os-contact__label">LinkedIn</span>
            <span className="os-contact__value">linkedin.com/in/tarosh</span>
          </span>
          <span className="os-contact__arrow"><ArrowUpRight size={18} /></span>
        </a>
      </div>

          <a href={`mailto:${EMAIL}`} className="btn btn--accent os-contact__cta">
            <Sparkles size={18} />
            Start a conversation
          </a>
        </div>
      </div>
    </div>
  );
}
