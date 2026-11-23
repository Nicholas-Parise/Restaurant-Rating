import { Component, OnInit } from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
    selector: 'app-privacy-policy',
    imports: [],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.css',
    standalone: true
})
export class PrivacyPolicyComponent implements OnInit{

    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(DOCUMENT) private document: Document
        ) { }

    ngOnInit() {
        this.setSEO();
    }


    setSEO(){

    const url = `https://deglazd.com/privacy-policy`;

    const description =
        `Deglazd's Privacy Policy`;

    // title
    this.title.setTitle(
        `Privacy Policy | Deglazd`
    );

    // description
    this.meta.updateTag({
        name: 'description',
        content: description
    });

    // OpenGraph
    this.meta.updateTag({
        property: 'og:title',
        content: `Privacy Policy | Deglazd`
    });

    this.meta.updateTag({
        property: 'og:description',
        content: description
    });

    this.meta.updateTag({
        property: 'og:url',
        content: url
    });

    this.meta.updateTag({
        property: 'og:type',
        content: 'website'
    });
    /*
    if (user.picture) {
        this.meta.updateTag({
        property: 'og:image',
        content: user.picture
        });
    }
    */

    // canonical
    let link: HTMLLinkElement =
        this.document.querySelector("link[rel='canonical']") ||
        this.document.createElement('link');

    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);

    this.document.head.appendChild(link);
    }

}
