import { Component, OnInit } from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-news',
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit{

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
     this.setSEO();
  }

  
  setSEO(){

    const url = `https://deglazd.com/news`;

    const description =
        `learn all about Deglazd's development and other news`;

    // title
    this.title.setTitle(
        `News | Deglazd`
    );

    // description
    this.meta.updateTag({
        name: 'description',
        content: description
    });

    // OpenGraph
    this.meta.updateTag({
        property: 'og:title',
        content: `News | Deglazd`
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
