import { Component, OnInit } from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
    selector: 'app-terms-of-service',
    imports: [],
    templateUrl: './terms-of-service.component.html',
    styleUrl: './terms-of-service.component.css',
    standalone: true
})
export class TermsOfServiceComponent implements OnInit{

constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
    ) { }

 ngOnInit() {
    this.setSEO();
 }

  setSEO(){

  const url = `https://deglazd.com/terms-of-service`;

  const description =
    `Deglazd's Terms of Service`;

  // title
  this.title.setTitle(
    `Terms of Service | Deglazd`
  );

  // description
  this.meta.updateTag({
    name: 'description',
    content: description
  });

  // OpenGraph
  this.meta.updateTag({
    property: 'og:title',
    content: `Terms of Service | Deglazd`
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
