import { Injectable, QueryList, ElementRef } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class SidebarNavigationService {
  focusedPanel: string;
  handleKeyDown(event: KeyboardEvent, panelId: string, panels: any[], buttons: QueryList<ElementRef>): void {
    const buttonsArray = buttons.toArray();
    const currentIndex = panels.findIndex((panel) => panel.id === panelId);

    if (event.key === "ArrowDown") {
      const nextIndex = (currentIndex + 1) % panels.length;
      buttonsArray[nextIndex].nativeElement.focus();
      this.focusedPanel = panels[nextIndex].id;
    } else if (event.key === "ArrowUp") {
      const prevIndex = (currentIndex - 1 + panels.length) % panels.length;
      buttonsArray[prevIndex].nativeElement.focus();
      this.focusedPanel = panels[prevIndex].id;
      event.preventDefault();
    }
  }

  handleFocus(panelId: string): void {
    this.focusedPanel = panelId;
  }

  handleBlur(): void {
    this.focusedPanel = null;
  }
}
