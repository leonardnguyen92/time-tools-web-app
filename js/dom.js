class DOM {

    /**
     * Gán nhanh text content cho một phần tử
     * 1. Nếu truyền id (string) → dùng document.getElementById
     * 2. Nếu truyền element → gán textContent trực tiếp
     * 3. Gán textContent = text
     * @param {string|HTMLElement} idOrElement - ID chuỗi hoặc phần tử DOM
     * @param {string} text - Nội dung văn bản cần gán
     * @returns {HTMLElement|null} - Trả về phần tử đã thao tác hoặc null nếu không tìm thấy
     */
    static setText(idOrElement, text) {
        let element;
        if (typeof idOrElement === "string") {
            element = document.getElementById(idOrElement);
        } else {
            element = idOrElement;
        }

        if (element) element.textContent = text;
        return element;
    }

    /**
     * 
     * @param {string|HTMLElement} idOrElement 
     * @param {string} text 
     * @returns 
     */
    static setHTML(idOrElement, text) {
        let element;
        if (typeof idOrElement === "string") {
            element = this.getElement(idOrElement);
        } else {
            element = idOrElement;
        }
        if (element) element.innerHTML = text;
        return element;
    }

    /**
     * Tạo phần tử DOM có sẵn class, id, text, v.v.
     * 1. document.createElement(tag)
     * 2. Nếu options có class → element.classList.add(...)
     * 3. Nếu options có id → element.id = ...
     * 4. Nếu options có text → element.textContent = ...
     * 5. Trả về phần tử vừa tạo
     * @param {string} tag 
     * @param {Object} options 
     * @returns {HTMLElement}
     */
    static createElement(tag, options = {}) {
        const tagElement = document.createElement(tag);
        if (options.class) {
            tagElement.classList.add(...options.class.split(" "));
        }
        if (options.id) {
            tagElement.id = options.id;
        }
        if (options.text) {
            tagElement.textContent = options.text;
        }
        return tagElement;
    }

    /**
     * Xóa toàn bộ nội dung của một phần tử
     * 1. Truy cập phần tử từ id hoặc element
     * 2. Dùng .innerHTML = "" hoặc .replaceChildren()
     * @param {string|HTMLElement} elementOrId 
     */
    static clearElementContent(elementOrId) {
        const element = typeof elementOrId === "string"
            ? document.getElementById(elementOrId)
            : elementOrId;

        if (element instanceof HTMLElement) {
            element.replaceChildren(); // an toàn hơn innerHTML
            return element;
        }

        console.warn("clearElementContent: element not found or invalid.");
        return null;
    }

    /**
     * Gắn nhiều phần tử con vào 1 phần tử cha
     * 1. Lặp qua mảng children
     * 2. Dùng parent.appendChild(child)
     * @param {HTMLElement} parent 
     * @param {HTMLElement[]} childrenArray 
     */
    static appendChildren(parent, childrenArray) {
        // if (!parent || !Array.isArray(childrenArray)) return;
        childrenArray.forEach(child => parent.appendChild(child));
    }

    /**
     * Wrapper để lấy element theo id(viết ngắn)
     * @param {string} id 
     * @returns {HTMLElement|null}
     */
    static getElement(id) {
        return document.getElementById(id);
    }
}
export default DOM;