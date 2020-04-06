// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Alert} from 'react-native';
import {shallowWithIntl} from 'test/intl-test-helper';

import Preferences from '@mm-redux/constants/preferences';

import PostInput from './post_input';

describe('PostInput', () => {
    const baseProps = {
        channelDisplayName: 'Test Channel',
        channelId: 'channel-id',
        cursorPositionEvent: '',
        handleCommentDraftChanged: jest.fn(),
        handlePostDraftChanged: jest.fn(),
        inputEventType: '',
        isLandscape: false,
        maxMessageLength: 4000,
        onPasteFiles: jest.fn(),
        readonly: false,
        rootId: '',
        theme: Preferences.THEMES.default,
        updateInitialValue: jest.fn(),
        userTyping: jest.fn(),
    };

    test('should match, full snapshot', () => {
        const wrapper = shallowWithIntl(
            <PostInput {...baseProps}/>,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('should emit the event but no text is save to draft', () => {
        const wrapper = shallowWithIntl(
            <PostInput {...baseProps}/>,
        );

        const instance = wrapper.instance();

        instance.changeDraft = jest.fn();
        instance.handleAppStateChange('active');
        expect(instance.changeDraft).not.toBeCalled();
    });

    test('should emit the event and text is save to draft', () => {
        const wrapper = shallowWithIntl(
            <PostInput {...baseProps}/>,
        );

        const instance = wrapper.instance();
        const value = 'some text';

        instance.setValue(value);
        instance.handleAppStateChange('background');
        expect(baseProps.handlePostDraftChanged).toHaveBeenCalledWith(baseProps.channelId, value);
        expect(baseProps.handlePostDraftChanged).toHaveBeenCalledTimes(1);
    });

    test('should not send multiple alerts when message is too long', () => {
        const wrapper = shallowWithIntl(
            <PostInput {...baseProps}/>,
        );

        const instance = wrapper.instance();
        const longString = [...Array(baseProps.maxMessageLength + 2).keys()].map(() => Math.random().toString(36).slice(0, 1)).join('');

        instance.handleTextChange(longString);
        instance.handleTextChange(longString.slice(1));

        expect(Alert.alert).toBeCalled();
        expect(Alert.alert).toHaveBeenCalledTimes(1);
    });
});

