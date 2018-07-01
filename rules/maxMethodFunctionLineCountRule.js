"use strict";
/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var OPTION_INCLUDE = 'include-nested-functions';
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.isEnabled = function () {
        return _super.prototype.isEnabled.call(this) && this.ruleArguments[0] > 0;
    };
    Rule.prototype.includesNested = function () {
        if (this.ruleArguments.length > 1) {
            return typeof this.ruleArguments[1] === 'string' && this.ruleArguments[1] === OPTION_INCLUDE;
        }
        return false;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MaxMethodLine(sourceFile, this.ruleName, {
            limit: this.ruleArguments[0],
            includesNested: this.includesNested()
        }));
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: 'max-method-function-line-count',
        description: 'Requires methods or functions to remain under a certain number of lines',
        rationale: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Limiting the number of lines allowed in a block allows blocks to remain small,\n            single purpose, and maintainable."], ["\n            Limiting the number of lines allowed in a block allows blocks to remain small,\n            single purpose, and maintainable."]))),
        // tslint:disable:max-line-length
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            An integer indicating the maximum line count of functions and methods.\n            An optional string \"include-nested-functions\" indicating if nested functions of functions are included in the count."], ["\n            An integer indicating the maximum line count of functions and methods.\n            An optional string \"include-nested-functions\" indicating if nested functions of functions are included in the count."]))),
        // tslint:enable:max-line-length
        options: {
            type: 'array',
            items: [
                {
                    type: 'number'
                },
                {
                    type: 'string',
                    "enum": [OPTION_INCLUDE]
                },
            ],
            additionalItems: false
        },
        optionExamples: [[true, 200, OPTION_INCLUDE]],
        type: 'maintainability',
        typescriptOnly: false
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function FAILURE_STRING(lineCount, lineLimit) {
    return "This method or function has " + lineCount + " lines, which exceeds the maximum of " + lineLimit + " lines allowed. " +
        'Consider breaking this up into smaller parts.';
}
// tslint:disable-next-line:max-classes-per-file
var MaxMethodLine = /** @class */ (function (_super) {
    __extends(MaxMethodLine, _super);
    function MaxMethodLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // cache for line count
        _this.cache = new Map();
        return _this;
    }
    MaxMethodLine.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (tsutils_1.isFunctionWithBody(node)) {
                _this.applyRule(node);
            }
            ts.forEachChild(node, cb);
        };
        ts.forEachChild(sourceFile, cb);
    };
    MaxMethodLine.prototype.applyRule = function (node) {
        var limit = this.options.limit;
        var lines = this.countLines(node.body);
        if (lines > limit) {
            this.addFailure(node.getStart(this.sourceFile), node.body.pos, FAILURE_STRING(lines, limit));
        }
    };
    MaxMethodLine.prototype.countLines = function (node) {
        var nodeText = node.getText();
        var lineCountIsCached = this.cache.has(nodeText);
        return lineCountIsCached
            ? this.cache.get(nodeText)
            : this.computeLineCount(node);
    };
    MaxMethodLine.prototype.computeLineCount = function (node) {
        var lineCount = this.getNodeLineCount(node) + 1;
        if (!this.options.includesNested) {
            lineCount -= this.countNestedFunctionLines(node);
        }
        this.cache.set(node.getText(), lineCount); // Cache result
        return lineCount;
    };
    MaxMethodLine.prototype.getNodeLineCount = function (node) {
        var firstNodeLine = ts.getLineAndCharacterOfPosition(this.sourceFile, node.getStart(this.sourceFile)).line;
        var lastNodeLine = ts.getLineAndCharacterOfPosition(this.sourceFile, node.end).line;
        var lineCount = lastNodeLine - firstNodeLine;
        return lineCount;
    };
    MaxMethodLine.prototype.countNestedFunctionLines = function (node) {
        var _this = this;
        var nestedLineCount = 0;
        var nbLinesToDropFunction = function (anode) {
            if (tsutils_1.isFunctionDeclaration(anode) || tsutils_1.isFunctionWithBody(anode)) {
                nestedLineCount += _this.countLines(anode.body);
            }
            ts.forEachChild(anode, nbLinesToDropFunction);
        };
        ts.forEachChild(node, nbLinesToDropFunction);
        return nestedLineCount;
    };
    return MaxMethodLine;
}(Lint.AbstractWalker));
var templateObject_1, templateObject_2;
