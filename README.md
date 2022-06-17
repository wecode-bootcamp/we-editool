<div id="top"></div>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />

<!-- PROJECT LOGO -->

<div align="center">
  <a href="https://github.com/wecode-bootcamp/we-editool">
    <img width="240" alt="Logo" src="https://user-images.githubusercontent.com/20152376/174044054-a0818405-4498-429e-a2bf-0c4edced080b.png">
  </a>

  <h1 align="center">we-editool</h3>

  <p align="center">
    light-weight, tagless and simple text edit tool!
    <br />
    <a href="https://github.com/wecode-bootcamp/we-editool#about-we-editool"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/wecode-bootcamp/we-editool/issues">Report Bug</a>
    ·
    <a href="https://github.com/wecode-bootcamp/we-editool/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-we-editool">About we-editool</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api">API</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About we-editool

![typing](https://user-images.githubusercontent.com/20152376/174046345-15243970-0b0a-4cc9-a351-23ba4cdb0a97.gif)

**light-weight** : The package is very light, about 24KB in compression.

**tagless** : Users don't need to know the tags.

**simple** : You can use 1 component for edit text.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

Use the package manager [npm](https://npmjs.com/package/we-editool) to install we-editool.

```sh
npm install we-editool
```

```sh
yarn add we-editool
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### when use WeEditor

```typescript
import React from 'react';
import { WeEditor, WeEditorRef } from 'we-editor';

function ReactComponent() {
  const editorRef = useRef<WeEditorRef>(null);

  const getHTML = () => editorRef.current?.getHTML();
  const getMarkdown = () => editorRef.current?.getMarkdown();

  return <WeEditor ref={editorRef} />;
}
```

### use your custom editor

```typescript
import React from 'react';
import { WeToolbar, htmlToMarkdown, WE_EDITOR_ID } from 'we-editor';

function CustomEditor() {
  const editorRef = useRef<HTMLDivElement>(null);

  const getHTML = () => editorRef.current?.innerHTML;
  const getMarkdown = () => htmlToMarkdown(editorRef.current?.innerHTML);

  return (
    <>
      <div contentEditable ref={editorRef} id={WE_EDITOR_ID} className="editor" />
      <WeToolbar editorRef={editorRef} />
    </>
  );
}
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- API -->

## API

### WeEditor

#### WeEditorProps

| name            | description                   | type    | default |
| --------------- | ----------------------------- | ------- | ------- |
| initialHTML     | initiate with html string     | string? | x       |
| initialMarkdown | initiate with markdown string | string? | x       |

#### WeEditorRef

| name        | description         | input    | output |
| ----------- | ------------------- | -------- | ------ |
| getHTML     | get html string     | no input | string |
| getMarkdown | get markdown string | no input | string |

### WeToolbar

#### WeToolbarProps

| name      | description             | type                            | default |
| --------- | ----------------------- | ------------------------------- | ------- |
| editorRef | editor reference object | React.RefObject<HTMLDivElement> | x       |

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to develop branch

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`][license-url] for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

JaeJun Jo - [@jtree03](https://twitter.com/jtree03) - [wowns0903@gmail.com](mailto:wowns0903@gmail.com)

Project Link: [https://github.com/wecode-bootcamp/we-editool](https://github.com/wecode-bootcamp/we-editool)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!-- MARKDOWN LINKS -->

[contributors-shield]: https://img.shields.io/github/contributors/wecode-bootcamp/we-editool.svg?style=for-the-badge
[contributors-url]: https://github.com/wecode-bootcamp/we-editool/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/wecode-bootcamp/we-editool.svg?style=for-the-badge
[forks-url]: https://github.com/wecode-bootcamp/we-editool/network/members
[stars-shield]: https://img.shields.io/github/stars/wecode-bootcamp/we-editool.svg?style=for-the-badge
[stars-url]: https://github.com/wecode-bootcamp/we-editool/stargazers
[issues-shield]: https://img.shields.io/github/issues/wecode-bootcamp/we-editool.svg?style=for-the-badge
[issues-url]: https://github.com/wecode-bootcamp/we-editool/issues
[license-shield]: https://img.shields.io/github/license/wecode-bootcamp/we-editool.svg?style=for-the-badge
[license-url]: https://github.com/wecode-bootcamp/we-editool/blob/main/LICENSE
